import {useEffect, useRef, useState} from "react";

function Item({item, trackHandler}) {
    const [imageLoaded, setImageLoaded] = useState(false)
    const [containerIsVisible, setContainerIsVisible] = useState(true);

    const containerRef = useRef(null);
    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            if (entries.length !== 0) {
                const entry = entries[0];
                trackHandler(item, containerIsVisible);
                setContainerIsVisible(entry.isIntersecting);
            }
        }, {
            threshold: 0.7
        });
        let containerRefValue = null;
        if (containerRef.current) {
            observer.observe(containerRef.current);
            containerRefValue = containerRef.current;
        }

        return () => {
            if (containerRefValue) observer.unobserve(containerRefValue);
        };
    }, [containerRef, containerIsVisible, item, trackHandler]);

    return (
        <div className="Item-container" ref={containerRef}>
            {imageLoaded && <div className="Item-title">{item.author}</div>}
            <img
                src={"https://picsum.photos/id/" + item.id + "/800/500"}
                onLoad={() => setImageLoaded(true)}
                alt={item.author}
            />
        </div>
    )
}

export default Item
