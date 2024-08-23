import React from 'react';
import ProgressDemo from './ProgessBar';
import SelectComponent from './SelectComponent';


// export default SelectDemo;
const PassengerSidebar = () => {
  return (
    <div
      id="left-group"
      className="lg:p-5 flex-col w-[400px] hidden lg:block  h-screen bg-white relative "
    >
            {/* <div className="flex justify-start flex-col text-base top-20 relative ">
       
      </div> */}
      <p className='mt-12'>Routes</p>
      <SelectComponent/>
      

        <p className='mt-10 mb-2'>Bus Information</p>
        <div className='bg-white h-52 w-full rounded-md border'>

          <div className='bg-white border-b w-full h-1/4 flex items-center justify-between p-2 rounded-t-md'>
            <div className='flex gap-2'>
            <p>Bus Number:</p>
            <p>12345</p>
            </div>
            <p className='underline text-green-400'>Toril Line</p>

          </div>

          <div className='h-3/4 flex flex-col'>
            
            
            <div className='w-full h-fit flex flex-col p-2'>
              <p className='mb-1'>Bus Capacity: 50</p>
              <p className='text-sm '>Taken: 30</p>
              <p className='text-sm'>Available: 20</p>


            </div>
            <div className='flex flex-col justify-center align-middle h-1/2 p-2'>
              <ProgressDemo/>
              <div className='flex text-xs justify-between'>
                <p>ADDU</p>
                <p>GMALL</p>
                <p>VPLAZA</p>
                <p>ABRZA</p>
              </div>
            </div>
          </div>

        </div>


    </div>
  );
};

export default PassengerSidebar;
