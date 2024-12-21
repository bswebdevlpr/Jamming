import Image from "next/image";

const MusicNote = () => {
  return (
    <Image
      src="/jamsession/popup/music-note.svg"
      alt="music note"
      width={16}
      height={16}
    />
  );
};

const Gallery = () => {
  return (
    <Image
      src="/jamsession/popup/gallery.svg"
      alt="gallery"
      width={16}
      height={16}
    />
  );
};

const Location = () => {
  return (
    <Image
      src="/jamsession/popup/location.svg"
      alt="location"
      width={16}
      height={16}
    />
  );
};

const OpenChat = () => {
  return (
    <Image
      src="/jamsession/popup/openchat.svg"
      alt="open chat link"
      width={16}
      height={16}
    />
  );
};

export { MusicNote, Gallery, Location, OpenChat };
