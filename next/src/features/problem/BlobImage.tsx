import { useEffect, useState } from 'react';
import { Skeleton } from '@/core/ui/Spinner';
import type { ProblemImage } from '@/data/types';

export function BlobImage({
  image,
  alt,
  className,
}: {
  image: ProblemImage;
  alt: string;
  className?: string;
}) {
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    const objectUrl = URL.createObjectURL(image.blob);
    setUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [image.blob]);

  if (!url) return <Skeleton className={className} />;

  return <img src={url} alt={alt} className={className} loading="lazy" />;
}
