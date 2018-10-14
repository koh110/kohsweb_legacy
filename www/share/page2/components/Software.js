import React from 'react'
import Wrapper from './WorkWrapper'
import Element from './SoftwareElement'
import npmImage from '../img/npm-logo-simplifed-with-white-space.png'
import twitWebSwitcher from '../img/twit-web-switcher.png'

const softs = [
  {
    url: 'https://www.npmjs.com/package/japanese-date',
    img: npmImage,
    title: 'japanese-date',
    desc: '日本語からDateオブジェクトを取得するparser。チャットボットに日本語で話かけるために作成'
  },
  {
    url: 'https://www.npmjs.com/package/outerclick',
    img: npmImage,
    title: 'outerclick',
    desc: '要素の外をクリックした時に発火するイベントハンドラを提供するJavaScriptモジュール'
  },
  {
    url: 'https://chrome.google.com/webstore/detail/twit-web-switcher/hedkbblkbhiagpppkgcbmkojnlphmcca?hl=ja',
    img: twitWebSwitcher,
    title: 'twit-web-switcher',
    desc: 'twitterのアカウントを切り替えるchrome拡張'
  }
]

const Software = () => {
  return (
    <Wrapper>
      <div>
        <h2>Software</h2>
        <div>いままで作ったやつを忘れないようにするやつ</div>
        { softs.map((e, i) => <Element key={`${i}-${e.title}`} { ...e } />) }
      </div>
    </Wrapper>
  )
}
export default Software