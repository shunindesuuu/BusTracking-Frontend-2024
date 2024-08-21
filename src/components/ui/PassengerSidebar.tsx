import React from 'react';

import * as Select from '@radix-ui/react-select';
import classnames from 'classnames';
import {
  CheckIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from '@radix-ui/react-icons';
import ProgressDemo from './ProgessBar';

type SelectItemProps = {
  children: React.ReactNode;
  className?: string;
  // Add any other props that might be passed to the component
} & React.ComponentPropsWithoutRef<typeof Select.Item>;

const SelectItem = React.forwardRef<HTMLDivElement, SelectItemProps>(
  ({ children, className, ...props }, forwardedRef) => {
    return (
      <Select.Item
        className={classnames(
          'text-[13px] leading-none hover:bg-gray-50 w-full text-violet11 rounded-[3px] flex items-center h-[25px] pr-[35px] pl-[25px] relative select-none data-[disabled]:text-mauve8 data-[disabled]:pointer-events-none data-[highlighted]:outline-none data-[highlighted]:bg-violet9 data-[highlighted]:text-violet1',
          className
        )}
        {...props}
        ref={forwardedRef}
      >
        <Select.ItemText>{children}</Select.ItemText>
        
      </Select.Item>
    );
  }
);

// export default SelectDemo;
const PassengerSidebar = () => {
  return (
    <div
      id="left-group"
      className="p-5 flex-col w-[400px] h-screen bg-white top-20 relative "
    >
            {/* <div className="flex justify-start flex-col text-base top-20 relative ">
       
      </div> */}
      <p>Routes</p>

       <Select.Root>
          <Select.Trigger
            className="inline-flex items-center justify-between rounded px-[15px]  text-[13px] leading-none h-[35px] gap-[5px] bg-white text-violet11  hover:bg-mauve3 border  data-[placeholder]:text-violet9 outline-none w-full"
            aria-label="Food"
          >
            <Select.Value placeholder="All" />
            <Select.Icon className="text-violet11">
              <ChevronDownIcon />
            </Select.Icon>
          </Select.Trigger>
          
          <Select.Portal >
            <Select.Content
              className="SelectContent bg-white shadow-md"
              position="popper"
              sideOffset={5}
            >
              <Select.ScrollUpButton className="flex items-center justify-center h-[25px] bg-white text-violet11 cursor-default">
                <ChevronUpIcon />
              </Select.ScrollUpButton>

              <Select.Viewport className="p-[5px] rounded-sm">
                <Select.Group>
                <SelectItem value="all" >All</SelectItem>
                  <SelectItem value="route1" >Route 1</SelectItem>
                  <SelectItem value="route2">Route 2</SelectItem>
                  <SelectItem value="route3">Route 3</SelectItem>
                </Select.Group>

              </Select.Viewport>
              <Select.ScrollDownButton className="flex items-center justify-center h-[25px] bg-white text-violet11 cursor-default">
                <ChevronDownIcon />
              </Select.ScrollDownButton>

            </Select.Content>
          </Select.Portal>
        </Select.Root>

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
