import { Text, Field, withDatasourceCheck } from '@sitecore-jss/sitecore-jss-nextjs';
import { ComponentProps } from 'lib/component-props';
import { JSX } from 'react';

type TimerComponentProps = ComponentProps & {
  fields: {
    heading: Field<string>;
  };
};

const TimerComponent = (props: TimerComponentProps): JSX.Element => (
  <div>
    <p>TimerComponent Component</p>
    <Text field={props.fields.heading} />
  </div>
);

export default withDatasourceCheck()<TimerComponentProps>(TimerComponent);
