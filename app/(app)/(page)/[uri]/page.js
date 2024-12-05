import { Page } from "@/models/Page";
import { User } from "@/models/User";
import { Event } from "@/models/Event";
import {
  FaDiscord,
  FaFacebook,
  FaTiktok,
  FaGithub,
  FaInstagram,
  FaInstagramSquare,
  FaTelegram,
  FaWhatsapp,
  FaYoutube,
  FaEnvelope,
  FaMobile,
  FaGripLines,
  FaPlus,
  FaSave,
  FaTrash,
  FaPhone,
  FaLink,
} from "react-icons/fa";
import "../../../globals.css";
import { FaLocationDot } from "react-icons/fa6";
import mongoose from "mongoose";
import { btoa } from "next/dist/compiled/@edge-runtime/primitives";
import Image from "next/image";
import Link from "next/link";

export const ButtonsIcons = {
  email: FaEnvelope,
  mobile: FaPhone,
  instagram: FaInstagram,
  facebook: FaFacebook,
  discord: FaDiscord,
  tiktok: FaTiktok,
  youtube: FaYoutube,
  whatsapp: FaWhatsapp,
  github: FaGithub,
  telegram: FaTelegram,
};

function buttonLink(key, value) {
  if (key === "mobile") {
    return "tel:" + value;
  }
  if (key === "email") {
    return "mailto:" + value;
  }
  return value;
}

export default async function UserPage({ params }) {
  const uri = params.uri;
  const decodedUri = decodeURIComponent(uri); // "/Saheb Bali"

  // Remove leading slash if necessary
  const name = decodedUri.startsWith("/") ? decodedUri.slice(1) : decodedUri;

  console.log(name); // "Saheb Bali"
  console.log({ uri });
  mongoose.connect(process.env.MONGO_URI);
  const page = await Page.findOne({ uri: name });
  console.log({ page });
  const user = await User.findOne({ email: page.owner });
  await Event.create({ uri: uri, page: uri, type: "view" });
  return (
    <div className="bg-blue-950 text-white min-h-screen">
      <div
        className="h-36 bg-gray-400 bg-cover bg-center"
        style={
          page.bgType === "color"
            ? { backgroundColor: page.bgColor }
            : { backgroundImage: `url(${page.bgImage})` }
        }
      ></div>
      <div className="aspect-square w-36 h-36 mx-auto relative -top-16 -mb-12">
        <Image
          className="rounded-full w-full h-full object-cover"
          src={user.image}
          alt="avatar"
          width={256}
          height={256}
        />
      </div>
      <h2 className="text-2xl text-center mb-1">{page.displayName}</h2>
      <h3 className="text-md flex gap-2 justify-center items-center text-white/70">
        <FaLocationDot className="h-4" />
        <span>{page.location}</span>
      </h3>
      <div className="max-w-xs mx-auto text-center my-2">
        <p>{page.bio}</p>
      </div>
      <div className="flex gap-2 justify-center mt-4 pb-4">
      {Object.keys(page.buttons).map((buttonKey) => {
  const Icon = ButtonsIcons[buttonKey];
  return (
    Icon && (
      <Link
        key={buttonKey}
        href={buttonLink(buttonKey, page.buttons[buttonKey])}
        className="rounded-full bg-white text-blue-950 p-2 flex items-center justify-center"
      >
        <Icon className="w-5 h-5" />
      </Link>
    )
  );
})}

      </div>
      <div className="max-w-2xl mx-auto grid md:grid-cols-2 gap-6 p-4 px-8">
        {page.links.map((link) => (
          <Link
            key={link.url}
            target="_blank"
            ping={
              process.env.URL +
              "api/click?url=" +
              btoa(link.url) +
              "&page=" +
              page.uri
            }
            className="bg-indigo-800 p-2 block flex"
            href={link.url}
          >
            <div className="relative -left-4 overflow-hidden w-16">
              <div className="w-16 h-16 bg-blue-700 aspect-square relative flex items-center justify-center aspect-square">
                {link.icon && (
                  <Image
                    className="w-full h-full object-cover"
                    src={link.icon}
                    alt={"icon"}
                    width={64}
                    height={64}
                  />
                )}
                {!link.icon && <FaLink className="w-8 h-8" />}
              </div>
            </div>
            <div className="flex items-center justify-center shrink grow-0 overflow-hidden">
              <div>
                <h3>{link.title}</h3>
                <p className="text-white/50 h-6 overflow-hidden">
                  {link.subtitle}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
