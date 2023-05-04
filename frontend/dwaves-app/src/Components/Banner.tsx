import "../Styles/Banner.scss"



export const Banner = () => {
    return (
        <div style={{ height: window.innerHeight }}>
            <section className="contain-banner">
                <div className="background-image" style={{ backgroundImage: `url(${process.env.REACT_APP_URL}stamina1.jpg)` }}>

                </div>
                <div className="content">
                    <div className="left">
                        <h1>
                            Title Playlist
                        </h1> 
                        <p>
                            Lorem ipsum dolor sit amet consectetur adipisicing 
                            elit. Possimus officia voluptate nisi, nihil repudiandae 
                            porro consequuntur, necessitatibus officiis mollitia, 
                            voluptatem libero quasi qui cum fugit enim optio facilis! 
                            Quaerat, odio.
                        </p>
                    </div>
                    <div className="right">
                        oihevrzoib
                    </div>
                </div>
                <div className="banner-pagination">
                
                </div>
            </section>
        </div>
    )
}