import { useState } from 'react'

// Shows a skeleton until the image has actually loaded, then fades it in.
// Width and height reserve space so nothing shifts while it loads.
export function SkeletonImage({ src, srcSm, alt, width, height, sizes, className = '', eager }) {
  const [loaded, setLoaded] = useState(false)

  // Handles images already in the browser cache, whose load event can fire before React attaches onLoad.
  const checkComplete = (node) => {
    if (node?.complete && node.naturalWidth > 0) setLoaded(true)
  }

  return (
    <div className={`relative overflow-hidden ${loaded ? '' : 'skeleton'} ${className}`}>
      <img
        ref={checkComplete}
        src={src}
        srcSet={srcSm ? `${srcSm} ${Math.round(width / 2)}w, ${src} ${width}w` : undefined}
        sizes={sizes}
        alt={alt}
        width={width}
        height={height}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
        onLoad={() => setLoaded(true)}
        className={`block h-full w-full object-cover object-top transition-opacity duration-500 motion-reduce:transition-none ${
          loaded ? 'opacity-100' : 'opacity-0'
        }`}
      />
    </div>
  )
}
