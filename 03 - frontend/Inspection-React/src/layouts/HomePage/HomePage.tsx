import { ExploreTopProjects } from "./components/ExploreTopProjects";
import { Heros } from "./components/Heroes";
import { ProjetCarousel } from "./components/ProjectCarousel";

export const HomePage = () => {
    return (
        <>
            <ExploreTopProjects/>
            <ProjetCarousel/>
            <Heros/>
        </>
    );
}