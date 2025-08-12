import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

const FeatureList = [
  {
    title: 'About ME',
    Svg: require('@site/static/img/universe.svg').default,
    description: (
      <>
        Engineer with experience in firmware development, familiar with notebook and server systems.
        <br />
        Specializing in problem-solving, debugging, and issue management.
      </>
    ),
  },
  {
    title: 'Tehnical Skill',
    Svg: require('@site/static/img/squirrel2.svg').default,
    description: (
      <>
        BIOS/Firmware development Project Management
        <br />
        Software and System Technology
        <br />
        System architecture
      </>
    ),
  },
];

function Feature({Svg, title, description}) {
  return (
    //col--6 此部分可調整寬度
    <div className={clsx('col col--6')}> 
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--left padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
