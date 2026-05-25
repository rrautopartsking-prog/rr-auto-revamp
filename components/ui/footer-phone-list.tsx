"use client";

interface FooterPhoneListProps {
  phones: string[];
}

export function FooterPhoneList({ phones }: FooterPhoneListProps) {
  if (phones.length === 1) {
    return (
      <a
        href={`tel:${phones[0].replace(/\s/g, "")}`}
        className="text-carbon-400 hover:text-gold transition-colors"
      >
        {phones[0]}
      </a>
    );
  }

  return (
    <div className="flex flex-col gap-1">
      {phones.map((phone, i) => (
        <a
          key={i}
          href={`tel:${phone.replace(/\s/g, "")}`}
          className="text-carbon-400 hover:text-gold transition-colors"
        >
          {phone}
        </a>
      ))}
    </div>
  );
}
