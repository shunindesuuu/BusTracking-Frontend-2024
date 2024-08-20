import React from 'react'
import * as Select from '@radix-ui/react-select';
import classnames from 'classnames';

const SideBar = () => {
  return (
    <div id="left-group" className="p-10 flex-col w-[400px] h-screen">
      <div className="flex justify-start text-base">
        Routes
        {/* Add more here */}
      </div>
      <Select.Root>
        <Select.Trigger className="" aria-label="Select Routes">
          <Select.Value placeholder="Select a fruit…" />
        </Select.Trigger>
        <Select.Portal>
          <Select.Content>
            <Select.Viewport>
              <Select.Group>
                <Select.Label className="px-[25px] text-xs leading-[25px] text-mauve11">
                  Fruits
                </Select.Label>
                {/* <SelectItem value="apple">Apple</SelectItem>
            <SelectItem value="banana">Banana</SelectItem>
            <SelectItem value="blueberry">Blueberry</SelectItem>
            <SelectItem value="grapes">Grapes</SelectItem>
            <SelectItem value="pineapple">Pineapple</SelectItem> */}
              </Select.Group>
            </Select.Viewport>
          </Select.Content>
        </Select.Portal>
      </Select.Root>
    </div>
  );
}



export default SideBar