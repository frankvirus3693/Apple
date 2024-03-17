import React from "react";

const Footer = () => {
  const socialMediaLinks = [
    {
      name: "Facebook",
      iconUrl:
        "data:image/png;base64,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",
      linkUrl: "#",
    },
    {
      name: "Email",
      iconUrl:
        "https://icon-library.com/images/email-icon-black/email-icon-black-0.jpg",
      linkUrl: "mailto:your.email@example.com",
    },
    {
      name: "Phone",
      iconUrl:
        "https://icon-library.com/images/free-telephone-icon/free-telephone-icon-27.jpg",
      linkUrl: "tel:+1234567890",
    },
    // เพิ่มโซเชียลมีเดียอื่น ๆ ตามต้องการ
  ];

  return (
    <footer className="bg-white text-black">
      <div className="container mx-auto py-8 flex justify-between items-center">
        <ul className="flex space-x-4">
          {socialMediaLinks.map((socialMedia, index) => (
            <li key={index}>
              <a href={socialMedia.linkUrl}>
                <img
                  src={socialMedia.iconUrl}
                  alt={`${socialMedia.name} Icon`}
                  className="w-8 h-8"
                />
              </a>
            </li>
          ))}
        </ul>
        <p className="text-sm">&copy; CIT5603 641413027 All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
