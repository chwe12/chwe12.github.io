import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';

import Heading from '@theme/Heading';
import {auroraLevel, useAurora} from '@site/src/components/AuroraSync/store';
import styles from './index.module.css';

/* 地磁暴時在橫幅說明為什麼出現極光 */
function AuroraNote() {
  const aurora = useAurora();
  if (auroraLevel(aurora) === 0) return null;
  const kp = (aurora.preview ?? aurora.kp).toFixed(1);
  return (
    <p className="aurora-note">
      🌌 地球此刻正在發生地磁暴（Kp {kp}），高緯度地區可能看得到極光
      {aurora.preview !== null && '（預覽）'}
    </p>
  );
}


function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <Heading as="h1" className="hero__title">
          {siteConfig.title}
        </Heading>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg"
            to="/docs/intro">
            Intro
          </Link>
        </div>
        <AuroraNote />
      </div>
    </header>
  );
}

export default function Home() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={`${siteConfig.title}`}
      description="Taipei Squirrel 的個人網站：學習筆記、自製小工具與遊戲紀錄">
      <HomepageHeader />
      <main>
        <HomepageFeatures />
      </main>
    </Layout>
  );
}
