import { useState, useEffect } from "react";
import Image from "next/image";

import { bikeWeekApp, bikeWeekSite } from "@/firebase/db";
import { getDocs, onSnapshot } from "firebase/firestore";

import bg from "../../public/background.png";
import lockup from "../../public/LOCK.png";

export async function getServerSideProps() {
  const initialSiteData = await getData(bikeWeekSite);
  const initialAppData = await getData(bikeWeekApp);

  console.log(initialAppData);

  async function getData(ref) {
    const snapshot = await getDocs(ref);
    const data = snapshot.docs.map((doc) => doc.data());

    return data;
  }

  return {
    props: {
      initialSiteData,
      initialAppData,
    },
  };
}

export default function Home({ initialSiteData, initialAppData }) {
  const [appData, setAppData] = useState(initialAppData);
  const [siteData, setSiteData] = useState(initialSiteData);

  useEffect(() => {
    const siteUnsub = onSnapshot(bikeWeekSite, (querySnapshot) => {
      setSiteData(querySnapshot.docs.map((doc) => doc.data()));
    });
    const appUnsub = onSnapshot(bikeWeekApp, (querySnapshot) => {
      setAppData(querySnapshot.docs.map((doc) => doc.data()));
    });

    return () => {
      siteUnsub();
      appUnsub();
    };
  });

  return (
    <div
      style={{
        background: `url(${bg.src})`,
        backgroundPosition: "center",
        backgroundSize: "cover",
      }}
      className="h-screen"
    >
      <div className="bg-black py-6">
        <div className="mx-auto w-4/12">
          <Image src={lockup} alt="Mobil 1/Advance Auto Parts" />
        </div>
      </div>
      <div className="flex justify-center mt-24 mb-8">
        <div className="bg-slate-800 w-80 text-slate-50 text-center py-6 px-12 rounded shadow-lg">
          <h2 className="uppercase text-2xl">Total Entries:</h2>
          <p className="font-bold text-4xl mt-2">
            {appData.length + siteData.length}
          </p>
        </div>
      </div>
      <div className="flex justify-center mb-8">
        <div className="bg-slate-800 w-80 text-slate-50 text-center py-6 px-12 rounded shadow-lg">
          <h2 className="uppercase text-2xl">App Entries:</h2>
          <p className="font-bold text-4xl mt-2">{appData.length}</p>
        </div>
      </div>
      <div className="flex justify-center">
        <div className="bg-slate-800 w-80 text-slate-50 text-center py-6 px-12 rounded shadow-lg">
          <h2 className="uppercase text-2xl">Site Entries:</h2>
          <p className="font-bold text-4xl mt-2">{siteData.length}</p>
        </div>
      </div>
    </div>
  );
}
