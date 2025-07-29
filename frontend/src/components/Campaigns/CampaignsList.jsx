/* eslint-disable react/prop-types */
import CampaignCard from "./CampaignCard";
import { useRef, useEffect } from "react";

export default function CampaignsList({campaigns, withDelete = false, withHelp = true}) {
  const listRef = useRef(null);
  
  const handleScroll = () => {
    const list = listRef.current;
    if (list) {
      const isAtBottom =
        list.scrollHeight - list.scrollTop <= list.clientHeight + 1;
      if (isAtBottom) {
        window.scrollTo({
          top: document.documentElement.scrollHeight,
          behavior: "smooth",
        });
      }
    }
  };

  useEffect(() => {
    const list = listRef.current;
    if (list) {
      list.addEventListener("scroll", handleScroll);
    }
    return () => {
      if (list) {
        list.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

  
  return (
    <div className="campaigns-list my-5" ref={listRef}>
      {campaigns && campaigns.map((camp) => 
        <CampaignCard campanha={camp} withDelete={withDelete} key={camp.id} withHelp={withHelp}/>
      )}
    </div>
  );
}
