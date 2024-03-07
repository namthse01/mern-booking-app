import express, {Request,Response, query} from 'express';
import Hotel from '../modules/hotel';
import { HotelSearchResponse } from '../shared/type';
import { param, validationResult } from 'express-validator';

const router = express.Router();

router.get('/search', async (req: Request, res: Response)=>{
  try{
    const query = constructSearchQuery(req.query);

    // console.log(query);
    
    let sortOptions = {};
    switch(req.query.sortOptions) {
      case "starRating":
        sortOptions = {starRating: -1}
        break;
      case "pricePerNightAsc":
        sortOptions = {pricePerNight: 1};
        break;
      case "pricePerNightDsc":
        sortOptions = {pricePerNight: -1};
        break;
    }

    // page-page size 
    const pageSize = 5;
    const pageNumber = parseInt(
      req.query.page? req.query.page.toString() : '1'
    );

    const skip = (pageNumber -1 )* pageSize
    const hotels = await Hotel.find(query).sort(sortOptions).skip(skip).limit(pageSize);

    // if(hotels.length === 0){
    // console.log(hotels);
    // }
    
    const total = await Hotel.countDocuments(query);
    
    const response: HotelSearchResponse ={
      data: hotels,
      pagination: {
        total,
        page: pageNumber,
        pages: Math.ceil(total / pageSize),
      },
    };
    res.json(response);
  } catch(error){
    console.log("error",error);
    res.status(500).json({message: "Something went wrong"});
  }
});

router.get('/:id', [
  param("id").notEmpty().withMessage("Hotel Id is required")
], async(req: Request, res: Response) => {
  const errors = validationResult(req);
  
  if(!errors.isEmpty()){
    return res.status(400).json({errors: errors.array()});
  }
  const id = req.params.id.toString();

  try{
    const hotel = await Hotel.findById(id);
    res.json(hotel);
  } catch(error){
    console.log(error);
    res.status(500).json({message: "Error fetching hotel"});
  }
});

const constructSearchQuery = (queryParams: any) => {
  let constructedQuery: any = {};

  if (queryParams.destination) {
    constructedQuery.$or = [
      { city: new RegExp(queryParams.destination, "i") },
      { country: new RegExp(queryParams.destination, "i") },
      { name: new RegExp(queryParams.destination, "i") } // Adding hotel name search
    ];
  }

  if (queryParams.adultCount) {
    constructedQuery.adultCount = {
      $gte: parseInt(queryParams.adultCount),
    };
  }

  if (queryParams.childCount) {
    constructedQuery.childCount = {
      $gte: parseInt(queryParams.childCount),
    };
  }

  if (queryParams.facilities) {
    constructedQuery.facilities = {
      $all: Array.isArray(queryParams.facilities)
        ? queryParams.facilities
        : [queryParams.facilities],
    };
  }

  if (queryParams.type) {
    constructedQuery.type = {
      $in: Array.isArray(queryParams.type)
        ? queryParams.type
        : [queryParams.type],
    };
  }

  if (queryParams.stars) {
    const starRatings = Array.isArray(queryParams.stars)
      ? queryParams.stars.map((star: string) => parseInt(star))
      : parseInt(queryParams.stars);

    constructedQuery.starRating = { $in: starRatings }; // Change to starRating
  }

  if (queryParams.maxPrice) {
    constructedQuery.pricePerNight = {
      $lte: parseInt(queryParams.maxPrice).toString(),
    };
  }
  
  return constructedQuery;
};
export default router;