import { Text, Field, withDatasourceCheck } from '@sitecore-jss/sitecore-jss-nextjs';
import { ComponentProps } from 'lib/component-props';
import { JSX, useState, useEffect } from 'react';

type TimerProps = ComponentProps & {
  fields: {
    heading: Field<string>;
  };
};

const Timer = (props: TimerProps): JSX.Element => {
  // Use state to store the current date and only update it when component mounts
  // Initialize with a static value to avoid hydration mismatch
  const [currentDate, setCurrentDate] = useState<string>(() => {
    // Check if we're on client side
    if (typeof window !== 'undefined') {
      return new Date().toDateString();
    }
    return '';
  });

  useEffect(() => {
    // Update the date on mount if it wasn't set during initialization
    if (!currentDate) {
      setCurrentDate(new Date().toDateString());
    }
  }, [currentDate]);

  return (
    <div>
      <p>
        Current date: {currentDate}
        <div>
          <Text field={props.fields.heading} />
        </div>
      </p>
    </div>
  );
};

export default withDatasourceCheck()<TimerProps>(Timer);
