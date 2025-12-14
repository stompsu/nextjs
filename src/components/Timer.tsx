import { Text, Field, withDatasourceCheck } from '@sitecore-jss/sitecore-jss-nextjs';
import { ComponentProps } from 'lib/component-props';
import { JSX, useState, useEffect } from 'react';

type TimerProps = ComponentProps & {
  fields: {
    heading: Field<string>;
  };
};

const Timer = (props: TimerProps): JSX.Element => {
  // Store the date in state and compute it once on mount
  const [currentDate, setCurrentDate] = useState<string>('');

  useEffect(() => {
    // Set the date once when component mounts on client side
    // This avoids hydration mismatch and computes the date only once
    setCurrentDate(new Date().toDateString());
  }, []); // Empty dependency array ensures this runs only once

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
