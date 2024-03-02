import { useMutation, useQuery } from "react-query";
import { useParams } from "react-router-dom";
import * as apiClient from '../api-client';
import ManageHotelForm from "../forms/MangeHotelForm/ManageHotelForm";
import { useAppContext } from "../contexts/AppContext";

const EditHotel =() => {

  const {hotelId} = useParams();
  const {showToast} = useAppContext();

  const {data: hotel} = useQuery("fetchMyHotelById", () =>
    apiClient.fetchMyHotelById(hotelId || ''), 
    {
      enabled: !!hotelId
    }
  );

  const {mutate, isLoading} = useMutation(apiClient.updateMyHotelById, {
    onSuccess: () => {
      showToast({message:"Hotel Saved!", type:"Success"})
    },
    onError: () =>{
      showToast({message: "Error Saveing Hotel", type:"Error"})
    },
  })

  const handleSave = (hotelFormData: FormData) => { 
    mutate(hotelFormData);
  }

  return <ManageHotelForm hotel={hotel} onSave={handleSave} isLoading={isLoading}/>
};

export default EditHotel;

