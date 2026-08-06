import type { Venue } from "@/types";

export const venues: Record<string, Venue> = {
  "nthu-lawn": {
    id: "nthu-lawn",
    name: "清華大學大草坪",
    campus: "NTHU",
    address: "新竹市東區光復路二段101號",
    mapUrl: "https://maps.google.com/?q=國立清華大學大草坪",
    meetingPoint: "大草坪中央集合區",
  },
  "nthu-mw": {
    id: "nthu-mw",
    name: "清華大學蒙民偉樓",
    campus: "NTHU",
    address: "新竹市東區光復路二段101號",
    mapUrl: "https://maps.google.com/?q=國立清華大學蒙民偉樓",
    meetingPoint: "一樓大廳",
  },
  "nthu-gym": {
    id: "nthu-gym",
    name: "清華大學體育館",
    campus: "NTHU",
    address: "新竹市東區光復路二段101號",
    mapUrl: "https://maps.google.com/?q=國立清華大學體育館",
    meetingPoint: "體育館正門",
  },
  "nycu-gymnasium": {
    id: "nycu-gymnasium",
    name: "陽明交通大學體育館",
    campus: "NYCU",
    address: "新竹市東區大學路1001號",
    mapUrl: "https://maps.google.com/?q=國立陽明交通大學體育館",
    meetingPoint: "體育館一樓入口",
  },
  "nthu-library": {
    id: "nthu-library",
    name: "清華大學圖書館",
    campus: "NTHU",
    address: "新竹市東區光復路二段101號",
    mapUrl: "https://maps.google.com/?q=國立清華大學圖書館",
    meetingPoint: "圖書館一樓大廳",
  },
  online: {
    id: "online",
    name: "線上活動",
    campus: "OTHER",
    description: "透過瀏覽器即可參加，無需到場。",
    mapUrl: "https://galgame-5c440.web.app",
  },
};
