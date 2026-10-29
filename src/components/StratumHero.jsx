import React, { useState, useEffect, useRef, useCallback } from 'react';
import './StratumHero.css';

const CH = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
const DUR = 400;

export const CHAPTERS_DATA = {
  vision: {
    id: 'vision',
    label: 'VISION',
    videoUrl: 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260928_024808_abbfad57-4496-4906-9abc-49f0d153d287.mp4',
    headline: ['让建筑灵感 ', '时刻被看见'],
    blurb: [
      '汇聚全球精选先锋建筑、空间形态与细部构造。基于大模型多维度深度打标解构，',
      '助你在方案构思、概念深化与汇报表达中迅速捕捉空间意图。',
      '从灵感萌生到方案落地，让每一个空间构想在此鲜活呈现。'
    ]
  },
  expression: {
    id: 'expression',
    label: 'EXPRESSION',
    videoUrl: 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260928_025948_2befd859-101e-49a4-8cb0-cdbb28cb11a7.mp4',
    headline: ['立面韵律 ', '空间叙事'],
    blurb: [
      '建筑是场地自我介绍的方式。我们赋予每一个项目独特的空间语汇，',
      '由它所在的街区、气候与每日置身其中的人群共同雕琢，',
      '使其在落成岁月流转之后，依然历久弥新、清晰可辨。'
    ]
  },
  craftsmanship: {
    id: 'craftsmanship',
    label: 'CRAFTSMANSHIP',
    videoUrl: 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260928_071544_17524fe8-2f07-4fbc-8a55-47518532df6f.mp4',
    headline: ['工匠之意 ', '历久弥坚'],
    blurb: [
      '以雕琢单件器物般的专注，对待石材、木料与光影的每一个交接。',
      '反复推敲每一道构造节点与材质肌理，直至细节坚实自洽，',
      '从初生基底到终章饰面，见证匠心凝聚。'
    ]
  },
  refinement: {
    id: 'refinement',
    label: 'REFINEMENT',
    videoUrl: 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260928_025948_9fe460cc-21c2-476c-8e61-6bf57c2d6775.mp4',
    headline: ['删繁就简 ', '静水深流'],
    blurb: [
      '剔除多余的视觉干扰，淬炼不可或缺的本质。',
      '直至整座建筑在每一个视点下都呈现出不可动摇的从容与克制，',
      '于极简中照见丰富与静谧。'
    ]
  },
  balance: {
    id: 'balance',
    label: 'BALANCE',
    videoUrl: 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260928_072855_ba37e93c-1119-4b93-a3cd-6b29ced17dc2.mp4',
    headline: ['建筑聚落 ', '自然共生'],
    blurb: [
      '在空间密度与广阔地表之间，在繁华商业与静谧空间之间寻求呼吸平衡。',
      '让每一次营造都与周遭城市与环境和谐相生，',
      '不仅立足当下，更为往后世代留存空间温度。'
    ]
  },
  origin: {
    id: 'origin',
    label: 'ORIGIN',
    videoUrl: 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260928_031433_64aea4c7-c53b-4e13-a1fc-bd73673b4fa5.mp4',
    headline: ['扎根大地 ', '构想未来'],
    blurb: [
      '深信优秀的建筑孕育宜人的街道，宜人的街道造就美好的城市。',
      '这一朴素信念始终指引着每一次概念构想与每一次空间交付，',
      '构筑值得被久久注视的灵感殿堂。'
    ]
  }
};

export function StratumHero({ onExploreClick }) {
  const [currentChapter, setCurrentChapter] = useState('vision');
  const [activeVideo, setActiveVideo] = useState('vision');
  const [isSwapping, setIsSwapping] = useState(false);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAnim, setIsAnim] = useState(true);

  const containerRef = useRef(null);
  const bgRef = useRef(null);
  const videoRefs = useRef({});

  // 视差阻尼跟踪
  const parallaxRef = useRef({
    tx: 0,
    ty: 0,
    cx: 0,
    cy: 0,
    running: false
  });

  // 解码文本辅助函数
  const decodeText = useCallback((el, targetText, duration = DUR) => {
    if (!el) return;
    const n = targetText.length;
    const t0 = performance.now();
    let lastRoll = 0;
    const rand = new Array(n);
    const roll = () => {
      for (let i = 0; i < n; i++) rand[i] = CH.charAt((Math.random() * CH.length) | 0);
    };
    roll();

    const step = (now) => {
      const p = Math.min(1, (now - t0) / duration);
      const front = p * n;
      let out = '';
      if (now - lastRoll > 45) {
        roll();
        lastRoll = now;
      }
      for (let i = 0; i < n; i++) {
        const c = targetText.charAt(i);
        if (i < front) out += c;
        else if (i < front + 3.6) out += (c === ' ' ? ' ' : rand[i]);
        else break;
      }
      el.textContent = out;
      if (p < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = targetText;
      }
    };
    requestAnimationFrame(step);
  }, []);

  // 鼠标视差
  useEffect(() => {
    const bg = bgRef.current;
    if (!bg) return;
    const p = parallaxRef.current;

    const tick = () => {
      p.cx += (p.tx - p.cx) * 0.045;
      p.cy += (p.ty - p.cy) * 0.045;
      const w = window.innerWidth;
      const h = window.innerHeight;
      const dx = -p.cx * w * 0.0156;
      const dy = -p.cy * h * 0.015;
      const cover = 2 * Math.max(Math.abs(dx) / w, Math.abs(dy) / h);
      const sc = 1 + cover + 0.014 * Math.max(0, p.cy);

      bg.style.transform = `translate3d(${dx.toFixed(2)}px, ${dy.toFixed(2)}px, 0) scale(${sc.toFixed(4)})`;

      if (Math.abs(p.tx - p.cx) < 0.0004 && Math.abs(p.ty - p.cy) < 0.0004) {
        p.running = false;
        return;
      }
      requestAnimationFrame(tick);
    };

    const wake = () => {
      if (!p.running) {
        p.running = true;
        requestAnimationFrame(tick);
      }
    };

    const handlePointerMove = (e) => {
      if (e.pointerType === 'touch') return;
      p.tx = (e.clientX / window.innerWidth) * 2 - 1;
      p.ty = (e.clientY / window.innerHeight) * 2 - 1;
      wake();
    };

    const handlePointerLeave = () => {
      p.tx = 0;
      p.ty = 0;
      wake();
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    document.addEventListener('pointerleave', handlePointerLeave);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      document.removeEventListener('pointerleave', handlePointerLeave);
    };
  }, []);

  // 初次入场动画与解码
  useEffect(() => {
    const animTimer = setTimeout(() => {
      setIsAnim(false);
    }, 2800);

    // 触发初始文本解码
    const labels = containerRef.current?.querySelectorAll('.t');
    labels?.forEach((el, index) => {
      const text = el.getAttribute('data-text') || el.textContent;
      setTimeout(() => {
        decodeText(el, text, 400);
      }, 350 + index * 45);
    });

    return () => clearTimeout(animTimer);
  }, [decodeText]);

  // 章节切换处理
  const handleSelectChapter = (chapterId) => {
    if (chapterId === currentChapter || isSwapping) return;
    setIsSwapping(true);

    // 播放对应视频
    const targetVideo = videoRefs.current[chapterId];
    if (targetVideo) {
      if (!targetVideo.src && targetVideo.dataset.src) {
        targetVideo.src = targetVideo.dataset.src;
        targetVideo.load();
      }
      targetVideo.play().catch(() => {});
      setActiveVideo(chapterId);
    }

    setTimeout(() => {
      setCurrentChapter(chapterId);
      setIsSwapping(false);
    }, 500);
  };

  const chapterData = CHAPTERS_DATA[currentChapter];

  return (
    <div
      ref={containerRef}
      className={`stratum-hero-stage ${isAnim ? 'anim' : ''} ${isMenuOpen ? 'nav-open' : ''}`}
    >
      {/* 视频与背景层 */}
      <div
        ref={bgRef}
        className="stratum-bg"
        role="img"
        aria-label="A stone monolithic architecture in water"
      >
        {Object.entries(CHAPTERS_DATA).map(([key, item]) => (
          <video
            key={key}
            ref={(el) => (videoRefs.current[key] = el)}
            className={activeVideo === key ? 'on' : ''}
            data-chapter={key}
            src={key === 'vision' ? item.videoUrl : undefined}
            data-src={key !== 'vision' ? item.videoUrl : undefined}
            poster={key === 'vision' ? './hero/background.png' : undefined}
            autoPlay={key === 'vision'}
            muted
            loop
            playsInline
            preload={key === 'vision' ? 'auto' : 'none'}
            aria-hidden="true"
          />
        ))}
        {/* 微暗角半透明层 */}
        <div className="stratum-overlay-vignette" />
      </div>

      {/* 外框：30u 缩进，1px 细线，26u 对角切角 */}
      <div className="stratum-frame">
        <span className="stratum-ln stratum-ln-t" />
        <span className="stratum-ln stratum-ln-b" />
        <span className="stratum-ln stratum-ln-l" />
        <span className="stratum-ln stratum-ln-r" />
        <span className="stratum-cn stratum-cn-tl" />
        <span className="stratum-cn stratum-cn-tr" />
        <span className="stratum-cn stratum-cn-bl" />
        <span className="stratum-cn stratum-cn-br" />

        {/* 顶部左侧 Logo */}
        <a
          className="stratum-logo"
          href="#"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          aria-label="Stratum — home"
        >
          <svg viewBox="0 0 163 19" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path d="M12 17 L2.75 17 L1.75 16.5 L1.5 15 L2.25 14 L12.25 14 L12.75 13.75 L13 13 L12.75 11.5 L12 11.25 L4.5 11.25 L2.5 10.5 L1.75 8.75 L1.5 6.5 L1.5 4.5 L2.5 3 L4.25 2.5 L7.25 2.25 L15 2.25 L15.75 3 L16 4.5 L15 5.5 L6 5.5 L5 5.75 L4.5 6.5 L4.75 7.5 L5.5 8.25 L13 8.25 L14.75 8.75 L15.5 9.5 L16 11 L15.75 15.5 L14.25 16.5ZM62.25 17 L60.75 17 L60 16.5 L56 12 L53.75 11.25 L53 11.5 L52.25 12 L51.75 16.5 L50.75 16.75 L49.5 16.5 L49 15.25 L49 3.5 L49.5 2.75 L50.5 2.25 L59 2.5 L62 2.5 L62.75 3 L63.5 4 L63.75 5 L63.25 9.5 L62 11 L60 11.5 L59.75 12 L60.25 13 L63 15.75 L63 16.5ZM86.5 17 L85.5 16.75 L85 16.25 L84.5 12.5 L84 12 L83 11.75 L76.5 12 L76 12.75 L75.75 16.5 L75 17 L73.5 16.5 L73 15 L73.25 6.5 L73.25 4.5 L74.5 3.25 L76.5 2.5 L82 2.25 L85.5 2.5 L86.5 3 L87.5 4.25 L87.5 5 L87.75 15 L87.25 16.5ZM33.5 17 L31.75 16.75 L31.25 16 L31 6 L30 5.5 L25.5 5.25 L25 3.75 L25.5 2.5 L38.5 2.5 L39.5 2.5 L40 3 L40.25 4.5 L39.5 5.25 L35 5.5 L34.25 6 L34 15.5ZM103.75 16.75 L102.5 16.75 L101.75 16 L101.5 6 L100.75 5.5 L96.25 5.25 L95.75 4 L96 3 L96.5 2.5 L109.5 2.5 L110.5 3.25 L110.75 4.5 L110 5.25 L105.75 5.25 L104.75 6 L104.5 15.5 L104.25 16.5ZM129.75 17 L122.5 17 L121 16.25 L120.25 15.5 L119.75 14.5 L119.75 13 L119.75 3.75 L120.25 2.75 L122 2.5 L122.5 3.5 L123 13.5 L124 14 L130 14.25 L131 13.75 L131.5 13 L131.5 3.25 L132 2.5 L133 2.5 L134 3 L134.25 3.75 L134 14.5 L133.5 15.5 L132.5 16.25 L131.5 16.75ZM160.5 17 L159.5 16.75 L158.75 16 L158.75 6.5 L158.5 5.75 L157.5 5.5 L155 5.5 L154 6 L153.75 16 L153.5 16.75 L152.25 17 L151.5 16.75 L151 15.75 L150.75 6 L150 5.5 L147.25 5.25 L146.5 5.75 L146 6.5 L146 16 L145.25 16.75 L143.5 16.75 L143.25 15.25 L143.25 3.75 L143.5 3 L144 2.5 L146.75 2.5 L159.5 2.5 L161.5 3 L161.75 3.5 L161.75 15.5 L161.5 16.5ZM53.75 8.5 L60 8.5 L60.75 7.75 L60.75 6.25 L60.25 5.5 L59.5 5.25 L53 5.5 L52.25 6 L52.25 7.5 L52.5 8.5ZM83.75 9.25 L84.5 8.75 L84.75 7.75 L84.5 6 L84 5.5 L77 5.5 L76 6 L76 8.5 L76.75 9.25Z" />
          </svg>
        </a>

        {/* 顶部右侧 Masthead 导航与药丸按钮 */}
        <nav className="stratum-masthead" aria-label="Main">
          <div className="stratum-navset" id="stratumNavset">
            <div className="stratum-links stratum-lbl">
              {['STORY', 'CONCEPTS', 'PROCESS', 'CONNECT', 'FILM'].map((name) => (
                <a
                  key={name}
                  href="#gallery-section"
                  onClick={(e) => {
                    e.preventDefault();
                    onExploreClick();
                  }}
                  onPointerEnter={(e) => {
                    const t = e.currentTarget.querySelector('.t');
                    if (t) decodeText(t, name);
                  }}
                >
                  <span className="t" data-text={name}>
                    {name}
                  </span>
                </a>
              ))}
            </div>

            {/* ENTER 磨砂玻璃胶囊 */}
            <a
              className="stratum-pill stratum-enter stratum-lbl"
              href="#gallery-section"
              onClick={(e) => {
                e.preventDefault();
                onExploreClick();
              }}
              onPointerEnter={(e) => {
                const t = e.currentTarget.querySelector('.t');
                if (t) decodeText(t, 'ENTER');
              }}
            >
              <svg className="ico" viewBox="0 0 7 11" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <rect x="0" y="0" width="4" height="5" />
                <rect x="3" y="4" width="4" height="4" />
                <rect x="0" y="7" width="4" height="4" />
              </svg>
              <span className="t" data-text="ENTER">
                ENTER
              </span>
            </a>
          </div>

          {/* MENU 奶油色切角药丸 */}
          <button
            className="stratum-pill stratum-menu stratum-lbl"
            type="button"
            aria-expanded={isMenuOpen}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            onPointerEnter={(e) => {
              const t = e.currentTarget.querySelector('.t');
              if (t) decodeText(t, isMenuOpen ? 'CLOSE' : 'MENU');
            }}
          >
            <svg className="ico" viewBox="0 0 10 10" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <rect x="0" y="0" width="4" height="4" rx=".8" />
              <rect x="6" y="0" width="4" height="4" rx=".8" />
              <rect x="0" y="6" width="4" height="4" rx=".8" />
              <rect x="6" y="6" width="4" height="4" rx=".8" />
            </svg>
            <span className="t" data-text={isMenuOpen ? 'CLOSE' : 'MENU'}>
              {isMenuOpen ? 'CLOSE' : 'MENU'}
            </span>
          </button>
        </nav>

        {/* 左侧 Index Rail 纵向章节轨 */}
        <ul className="stratum-index" aria-label="Chapters">
          {Object.entries(CHAPTERS_DATA).map(([key, item]) => {
            const isActive = currentChapter === key;
            return (
              <li key={key} className={isActive ? 'on' : ''}>
                <a
                  href={`#${key}`}
                  aria-current={isActive ? 'true' : undefined}
                  onClick={(e) => {
                    e.preventDefault();
                    handleSelectChapter(key);
                  }}
                  onPointerEnter={(e) => {
                    const t = e.currentTarget.querySelector('.t');
                    if (t) decodeText(t, item.label);
                  }}
                >
                  <span className="t" data-text={item.label}>
                    {item.label}
                  </span>
                </a>
              </li>
            );
          })}
        </ul>

        {/* 视口中央 Hero 主体内容 */}
        <div className={`stratum-hero ${isSwapping ? 'swapping' : ''}`}>
          <h1 className="stratum-headline">
            <span className="hrow">
              <span className="hrise">{chapterData.headline[0]}</span>
            </span>
            <span className="hrow">
              <span className="hrise">{chapterData.headline[1]}</span>
            </span>
          </h1>

          <p className="stratum-blurb">
            {chapterData.blurb.map((line, idx) => (
              <React.Fragment key={idx}>
                {idx > 0 && <br />}
                {line}
              </React.Fragment>
            ))}
          </p>

          {/* CTA: UNCOVER OUR APPROACH */}
          <a
            className="stratum-cta stratum-lbl"
            href="#gallery-section"
            onClick={(e) => {
              e.preventDefault();
              onExploreClick();
            }}
            onPointerEnter={(e) => {
              const t = e.currentTarget.querySelector('.t');
              if (t) decodeText(t, 'UNCOVER OUR APPROACH');
            }}
          >
            <span className="cta-glass" />
            <svg className="cta-edge" viewBox="0 0 190 41" preserveAspectRatio="none" aria-hidden="true">
              <path
                d="M3.5.5 H179.5 L189.5 10.5 V37.5 L186.5 40.5 H10.5 L.5 30.5 V3.5 Z"
                vectorEffect="non-scaling-stroke"
              />
            </svg>
            <span className="cta-in">
              <svg className="ico" viewBox="0 0 7 11" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <rect x="0" y="0" width="4" height="5" />
                <rect x="3" y="4" width="4" height="4" />
                <rect x="0" y="7" width="4" height="4" />
              </svg>
              <span className="t" data-text="UNCOVER OUR APPROACH">
                UNCOVER OUR APPROACH
              </span>
            </span>
          </a>
        </div>

        {/* 底部 Dock 栏 */}
        <div className="stratum-dock">
          <span className="rule" />
          <span className="div div-l" />
          <span className="div div-r" />

          {/* AUDIO 开关 */}
          <button
            className={`audio stratum-lbl ${!isAudioOn ? 'muted' : ''}`}
            type="button"
            aria-pressed={isAudioOn}
            onClick={() => {
              const next = !isAudioOn;
              setIsAudioOn(next);
              const t = containerRef.current?.querySelector('.audio .t');
              if (t) decodeText(t, next ? 'AUDIO ON' : 'AUDIO OFF');
            }}
            onPointerEnter={(e) => {
              const t = e.currentTarget.querySelector('.t');
              if (t) decodeText(t, isAudioOn ? 'AUDIO ON' : 'AUDIO OFF');
            }}
          >
            <svg className="ico" viewBox="0 0 14 11" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path d="M7 0 L7 11 L0.6 7.6 L0.6 3.4 Z" stroke="none" />
              <path className="wave" d="M9.4 2.2 C10.9 4 10.9 7 9.4 8.8" fill="none" strokeWidth="1.3" strokeLinecap="round" />
              <path className="wave" d="M11.9 0.6 C14.1 3.3 14.1 7.7 11.9 10.4" fill="none" strokeWidth="1.3" strokeLinecap="round" />
              <path className="slash" d="M9.2 2.4 L13.8 8.6 M13.8 2.4 L9.2 8.6" fill="none" strokeWidth="1.3" strokeLinecap="round" />
            </svg>
            <span className="t" data-text={isAudioOn ? 'AUDIO ON' : 'AUDIO OFF'}>
              {isAudioOn ? 'AUDIO ON' : 'AUDIO OFF'}
            </span>
          </button>

          {/* SCROLL TO UNCOVER */}
          <a
            className="scroll stratum-lbl"
            href="#gallery-section"
            onClick={(e) => {
              e.preventDefault();
              onExploreClick();
            }}
            onPointerEnter={(e) => {
              const t = e.currentTarget.querySelector('.t');
              if (t) decodeText(t, 'SCROLL TO UNCOVER');
            }}
          >
            <svg className="ico" viewBox="0 0 5 7" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path d="M0 0 H5 L2.5 3 Z" />
              <path d="M0 4 H5 L2.5 7 Z" />
            </svg>
            <span className="t" data-text="SCROLL TO UNCOVER">
              SCROLL TO UNCOVER
            </span>
          </a>

          {/* TALK WITH US */}
          <a
            className="talk stratum-lbl"
            href="#gallery-section"
            onClick={(e) => {
              e.preventDefault();
              onExploreClick();
            }}
            onPointerEnter={(e) => {
              const t = e.currentTarget.querySelector('.t');
              if (t) decodeText(t, 'TALK WITH US');
            }}
          >
            <span className="t" data-text="TALK WITH US">
              TALK WITH US
            </span>
            <svg className="ico" viewBox="0 0 16 15" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path d="M8 .8 C12 .8 15.2 3.8 15.2 7.4 C15.2 11 12 14 8 14 C6.6 14 5.3 13.6 4.2 13 L.9 13.9 L1.9 10.9 C1.2 9.9 .8 8.7 .8 7.4 C.8 3.8 4 .8 8 .8 Z" />
              <g fill="currentColor" stroke="none">
                <circle cx="5.2" cy="7.4" r=".95" />
                <circle cx="8" cy="7.4" r=".95" />
                <circle cx="10.8" cy="7.4" r=".95" />
              </g>
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}
