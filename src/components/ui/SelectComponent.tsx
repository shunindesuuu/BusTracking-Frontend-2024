import React from 'react';
import * as Select from '@radix-ui/react-select';
import classnames from 'classnames';
import { ChevronDownIcon, ChevronUpIcon } from '@radix-ui/react-icons';

interface RouteNames {
  id: number;
  routeName: string;
  routeColor: string;
}

type SelectItemProps = {
  children: React.ReactNode;
  className?: string;
} & React.ComponentPropsWithoutRef<typeof Select.Item>;

const SelectItem = React.forwardRef<HTMLDivElement, SelectItemProps>(
  ({ children, className, ...props }, forwardedRef) => {
    return (
      <Select.Item
        className={classnames(
          'text-[12px] leading-none hover:bg-gray-100 w-full text-black rounded-md flex items-center h-[30px] px-4 py-1 relative select-none data-[disabled]:text-gray-500 data-[disabled]:pointer-events-none data-[highlighted]:outline-none data-[highlighted]:bg-gray-200',
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

const SelectComponent: React.FC<SelectComponentProps & { onSelectRoute: (routeName: string) => void; }> = ({ routes, onSelectRoute }) => {
  const sortedRoutes = [...routes].sort((a, b) => a.routeName.localeCompare(b.routeName));
  return (
    <div className="inline-block relative shadow-lg rounded-lg border border-gray-200 p-2 bg-white w-full max-w-xs md:max-w-sm lg:max-w-md " style={{ width: '150px' }}>
      <Select.Root onValueChange={onSelectRoute}>
        <Select.Trigger
          className="inline-flex items-center justify-between rounded-lg px-4 py-2 text-[12px] leading-none h-[30px] gap-2 bg-white text-black hover:bg-gray-50 border border-gray-300 outline-none w-full shadow-sm"
          aria-label="Select Route"
        >
          <Select.Value placeholder="Select Route" />
          <Select.Icon className="text-black">
            <ChevronDownIcon />
          </Select.Icon>
        </Select.Trigger>

        <Select.Portal>
          <Select.Content
            className="SelectContent bg-white shadow-lg rounded-md border border-gray-200 z-[9999]"
            position="popper"
            sideOffset={5}
          >
            <Select.ScrollUpButton className="flex items-center justify-center h-[25px] bg-white text-black cursor-default">
              <ChevronUpIcon />
            </Select.ScrollUpButton>

            <Select.Viewport className="p-2 rounded-md">
              <Select.Group>
                <SelectItem value="all">All</SelectItem>
                {sortedRoutes.map((route) => (
                  <SelectItem key={route.id} value={route.routeName}>
                    {route.routeName}
                  </SelectItem>
                ))}
              </Select.Group>
            </Select.Viewport>

            <Select.ScrollDownButton className="flex items-center justify-center h-[25px] bg-white text-black cursor-default">
              <ChevronDownIcon />
            </Select.ScrollDownButton>
          </Select.Content>
        </Select.Portal>
      </Select.Root>
    </div>
  );
};

export default SelectComponent;