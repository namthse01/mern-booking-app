import { useQuery } from 'react-query';
import * as apiClient from '../api-client';
import BookingForm from '../forms/BookingForm/BookingForm';
import { useParams } from "react-router-dom";
import { useSearchContext } from '../contexts/SearchContext';
import { useEffect, useState } from 'react';
import BookingDetailsSummary from '../components/BookingDetailsSummary';
import { Elements } from '@stripe/react-stripe-js';
import { useAppContext } from '../contexts/AppContext';

const Booking = () => {

  const { stripePromise } = useAppContext();

  const {data: currentUser} = useQuery("fetchCurrentUser", apiClient.fetchCurrentUser);

  const search = useSearchContext();
  const {hotelId} = useParams();
  
  const [numberOfNights, setNumberOfNight] = useState<number>(0);
  
  useEffect(() => {
    if(search.checkIn && search.checkOut){
      const night = Math.abs(search.checkOut.getTime() - search.checkIn.getTime()) / (1000 * 60 * 60 * 24);

      setNumberOfNight(Math.ceil(night));
    }
  },[search.checkIn, search.checkOut]);

  const { data: paymentIntentData} = useQuery("createPaymentIntent", 
    () => apiClient.createPaymentIntent(hotelId as string, numberOfNights.toString()),
    {
      enabled: !!hotelId && numberOfNights > 0,
    }
  )

  const {data: hotel} = useQuery("fetchHotelById", () => apiClient.fetchHotelById(hotelId as string),{
    enabled: !!hotelId,
  });

  if(!hotel){
    return <></>
  }
  
  return(
    <div className='grid md:grid-cols-[1fr_2fr]'>

      {/* Booking summary */}
      <BookingDetailsSummary 
        checkIn={search.checkIn} 
        checkOut={search.checkOut} 
        adultCount = {search.adultCount} 
        childCount = {search.childCount}
        numberOfNights = {numberOfNights}
        hotel = {hotel}
      />

      {/* Booking Form */}
      {currentUser && paymentIntentData && ( 
        <Elements stripe={stripePromise}
          options ={{
            clientSecret: paymentIntentData.clientSecret,
          }}
        >
          <BookingForm currentUser= {currentUser} paymentIntent = {paymentIntentData}/> 
        </Elements>
      )}
    </div>
  )
};

export default Booking;