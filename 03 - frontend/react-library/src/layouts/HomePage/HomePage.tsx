import { Carousel } from "./components/Carousel";
import { ExploreTopProjects } from "./components/ExploreTopProjects";
import { Heros } from "./components/Heroes";
import { LibrayServices } from "./components/LibraryServices";
import { ProjetCarousel } from "./components/ProjectCarousel";

export const HomePage = () => {
    return (
        <>
            <ExploreTopProjects/>
            <ProjetCarousel/>
            {/* <Carousel/> */}
            <Heros/>
            {/* <LibrayServices/> */}
        </>
    );
}