import ImageSlider from "./imageSlider";
import a1 from "../assets/a1.jpg";
import a2 from "../assets/a2.jpg";
import a3 from "../assets/a3.png";
import a4 from "../assets/a4.png";
import a5 from "../assets/a5.png";
import a6 from "../assets/a6.jpg";
import a7 from "../assets/a7.png";
import a8 from "../assets/a8.png";

const PictureSlider = () => {
  const slides = [
    { url: a1 },
    { url: a2 },
    { url: a3 },
    { url: a4 },
    { url: a5 },
    { url: a6 },
    { url: a7 },
    { url: a8 },
  ];
  const containerStyles = {
    width: "100%",
    height: "750px",
    margin: "0 auto",
  };
  return (
    <div>
      <div style={containerStyles}>
        <ImageSlider slides={slides} />
      </div>
    </div>
  );
};

export default PictureSlider;
