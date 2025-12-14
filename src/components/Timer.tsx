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
  const [currentDate, setCurrentDate] = useState<string>('');

  useEffect(() => {
    // Set the date on mount (client-side only to avoid SSR hydration mismatch)
    setCurrentDate(new Date().toDateString());
  }, []);

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
