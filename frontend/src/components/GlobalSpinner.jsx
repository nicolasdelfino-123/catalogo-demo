import React, { useEffect, useState } from "react";
import Spinner from "../assets/spinner_si.svg";

const GlobalSpinner = () => {
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        const handleLoad = () => {
            setTimeout(() => {
                setVisible(false);
            }, 300); // pequeño delay para que el spinner se vea
        };

        if (document.readyState === "complete") {
            handleLoad();
        } else {
            window.addEventListener("load", handleLoad);
        }

        return () => {
            window.removeEventListener("load", handleLoad);
        };
    }, []);

    if (!visible) return null;

    return (
        <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white">
            <img src={Spinner} alt="Loading" className="w-54 h-54" />
        </div>
    );
};

export default GlobalSpinner;