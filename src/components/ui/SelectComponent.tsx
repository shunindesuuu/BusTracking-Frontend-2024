import React from 'react'

import * as Select from '@radix-ui/react-select';
import classnames from 'classnames';
import {
  CheckIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from '@radix-ui/react-icons';

interface RouteNames {
  id: number;
  routeName: string;
  routeColor: string;
}

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
          'text-[13px] leading-none hover:bg-gray-100 w-full text-violet11 rounded-[3px] flex items-center h-[25px] pr-[35px] pl-[25px] relative select-none data-[disabled]:text-mauve8 data-[disabled]:pointer-events-none data-[highlighted]:outline-none data-[highlighted]:bg-violet9 data-[highlighted]:text-violet1',
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

interface SelectComponentProps {
  routes: RouteNames[];
}

const SelectComponent: React.FC<SelectComponentProps> = ({ routes }) => {
  const sortedRoutes = [...routes].sort((a, b) => a.routeName.localeCompare(b.routeName));
  return (
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
        className="SelectContent bg-white shadow-md z-[9999]"
        position="popper"
        sideOffset={5}
      >
        <Select.ScrollUpButton className="flex items-center justify-center h-[25px] bg-white text-violet11 cursor-default">
          <ChevronUpIcon />
        </Select.ScrollUpButton>

        <Select.Viewport className="p-[5px] rounded-sm z-50">
          <Select.Group>
              <SelectItem value="all" >All</SelectItem>
              {sortedRoutes.map((route) => (
                <SelectItem key={route.id} value={route.routeName}>
                 {route.routeName}
                </SelectItem>
              ))}
          </Select.Group>

        </Select.Viewport>
        <Select.ScrollDownButton className="flex items-center justify-center h-[25px] bg-white text-violet11 cursor-default">
          <ChevronDownIcon />
        </Select.ScrollDownButton>

      </Select.Content>
    </Select.Portal>
  </Select.Root>
  )
}

export default SelectComponent