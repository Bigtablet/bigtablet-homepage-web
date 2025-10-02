import "./style.scss";
import { getCollaborationLogos } from "src/utils/collaborations/getLogo";
import Marquee from "./marquee.client";

const Collaborations = () => {
    const logos = getCollaborationLogos(); // public/images/collaborations 읽음
    return <Marquee logos={logos} speedSec={10} />; // 더 빠르게
};

export default Collaborations;