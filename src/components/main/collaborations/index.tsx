import "./style.scss";
import { getCollaborationLogos } from "src/utils/collaborations/getLogo";
import Marquee from "./marquee.client";

const Collaborations = () => {
    const logos = getCollaborationLogos();
    return <Marquee logos={logos} speedSec={10} />;
};

export default Collaborations;