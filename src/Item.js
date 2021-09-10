import {useEffect, useRef, useState} from "react";

function Item({item, trackHandler}) {
    const [imageLoaded, setImageLoaded] = useState(false)
    const [containerIsVisible, setContainerIsVisible] = useState(true);

    const containerRef = useRef(null);
    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            if (entries.length !== 0) {
                const entry = entries[0];
                setContainerIsVisible(entry.isIntersecting);
            }
        }, {
            threshold: 0.7
        });
        let containerRefValue = null;
        if (containerRef.current && imageLoaded) {
            observer.observe(containerRef.current);
            containerRefValue = containerRef.current;
        }

        return () => {
            if (containerRefValue) observer.unobserve(containerRefValue);
        };
    }, [containerRef, containerIsVisible, item, trackHandler, imageLoaded]);

    useEffect(() => {
        let delay = null
        if (containerIsVisible) {
            //set delay 1 sec
            delay = setTimeout(() => {
                trackHandler(item, containerIsVisible);
            }, 500)
        } else {
            //send immediately
            trackHandler(item, containerIsVisible);
        }

        return () => {
            clearTimeout(delay)
        }
    }, [containerIsVisible, trackHandler, item])

    return (
        <div className="Item-container" ref={containerRef}>
            {imageLoaded && <div className="Item-title">{item.author}</div>}
            <img
                src={"https://picsum.photos/id/" + item.id + "/500/200"}
                onLoad={() => setImageLoaded(true)}
                alt={item.author}
            />
        </div>
    )
}

export default Item
