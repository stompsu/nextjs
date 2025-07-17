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
    <p>Timer Component</p>
    <Text field={props.fields.heading} />
  </div>
);

export default withDatasourceCheck()<TimerProps>(Timer);

// write react component that displays current time
