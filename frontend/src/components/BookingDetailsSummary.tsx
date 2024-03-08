import { HotelType } from "../../../backend/src/shared/type"

type Props = {
  checkIn: Date,
  checkOut: Date,
  adultCount: number,
  childCount: number,
  numberOfNights: number,
  hotel: HotelType
}

const BookingDetailsSummary = ({checkIn, checkOut, adultCount, childCount, numberOfNights, hotel}: Props) => {
  return(
    <div className="grid gap-4 rounded-lg border border-slate-300 p-5 h-fit">
      <h2 className="text-xl font-bold">Your Booking Details</h2>

      {/* Location */}
      <div className="border-b py-2">
        Location:
        <div className="font-bold">{`${hotel.name}, ${hotel.city}, ${hotel.country}`}</div>
      </div>
      {/* CheckIn and checkOut */}
      <div className="flex justify-between">
        <div>
          Check In
          <div className="font-bold">{checkIn.toDateString()}</div>
        </div>
        <div>
          Check Out
          <div className="font-bold">{checkOut.toDateString()}</div>
        </div>
      </div>

      {/* Total night stay */}
      <div className="border-t border-b py-2">
        Total nights stay:
        <div className="font-bold">
          {numberOfNights} nights
        </div>
      </div>

      {/* Adults and children count */}
      <div>
        Guest{" "}
        <div className="font-bold">
          {adultCount} adults & {childCount} childrens
        </div>
      </div>
    </div>
  )
}

export default BookingDetailsSummary