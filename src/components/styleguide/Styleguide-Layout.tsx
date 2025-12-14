import { JSX } from 'react';
import {
  Placeholder,
  getChildPlaceholder,
  getFieldValue,
  ComponentRendering,
  HtmlElementRendering,
} from '@sitecore-jss/sitecore-jss-nextjs';
import { ComponentProps } from 'lib/component-props';

/**
 * The main layout (columns) of the styleguide.
 * Navigation is automatically generated based on the components added to the layout,
 * and does not need to be manually maintained.
 */
const StyleguideLayout = (props: ComponentProps): JSX.Element => {
  const getRendering = (section: ComponentRendering | HtmlElementRendering) =>
    section as ComponentRendering;

  const convertUID = (uid?: string) => {
    if (!uid) return '';
    return uid.replace(/[{}]/g, '');
  };

  // this code reads the components in the child placeholders of this component,
  // and projects them into the left navigation column for the styleguide
  // Optimized to use a single iteration instead of chained map operations
  const sections = getChildPlaceholder(props.rendering, 'jss-styleguide-layout')
    .filter((section) => getFieldValue(getRendering(section), 'heading'))
    .map((section) => {
      const sectionRendering = getRendering(section);
      const sectionHeading = getFieldValue<string>(sectionRendering, 'heading');
      const sectionId = `i${convertUID(sectionRendering.uid)}`;

      const children = getChildPlaceholder(sectionRendering, 'jss-styleguide-section')
        .filter((component) => getFieldValue(getRendering(component), 'heading'))
        .map((component) => {
          const componentRendering = getRendering(component);
          return {
            heading: getFieldValue<string>(componentRendering, 'heading'),
            id: `i${convertUID(componentRendering.uid)}`,
          };
        });

      return (
        <nav key={sectionHeading} className="nav flex-column pt-2">
          <a href={`#${sectionId}`} className="nav-item fw-bold">
            {sectionHeading}
          </a>
          {children.length > 0 && (
            <nav className="nav flex-column">
              {children.map(
                (child) =>
                  child.heading && (
                    <a key={child.id} href={`#${child.id}`}>
                      {child.heading}
                    </a>
                  )
              )}
            </nav>
          )}
        </nav>
      );
    });

  return (
    <div className="row">
      <div className="col-sm-8 col-lg-10">
        <Placeholder name="jss-styleguide-layout" rendering={props.rendering} />
      </div>
      <div className="col-sm-4 col-lg-2 order-sm-first pt-2">{sections}</div>
    </div>
  );
};

export default StyleguideLayout;
