import { Text, Field, withDatasourceCheck } from '@sitecore-jss/sitecore-jss-nextjs';
import { ComponentProps } from 'lib/component-props';
import { JSX } from 'react';

type TimerProps = ComponentProps & {
  fields: {
    heading: Field<string>;
  };
};

const Timer = (props: TimerProps): JSX.Element => (
  <div>
    <p>Current date: {new Date().toDateString()}
      <div><Text field={props.fields.heading} /></div>
    </p>
  </div>
);

export default withDatasourceCheck()<TimerProps>(Timer);
