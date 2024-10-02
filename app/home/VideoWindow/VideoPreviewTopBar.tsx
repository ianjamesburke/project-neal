import React from 'react';
import { Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

const TextEditor: React.FC<{ onRefresh: () => void }> = ({ onRefresh }) => {
  return (
    <div className="flex flex-wrap gap-1 sm:gap-2 w-full p-2">
      <Button variant="default" size="sm" aria-label="font" className="text-xs sm:text-sm">
        Font
      </Button>
      <Button variant="default" size="icon" aria-label="Decrease font size" className="w-6 h-6 sm:w-8 sm:h-8">-</Button>
      <span className="flex items-center justify-center text-xs sm:text-sm text-white">48</span>
      <Button variant="default" size="icon" aria-label="Increase font size" className="w-6 h-6 sm:w-8 sm:h-8">+</Button>
      <Button variant="default" size="icon" aria-label="Bold" className="w-6 h-6 sm:w-8 sm:h-8">
        <Bold className="w-4 h-4 sm:w-5 sm:h-5" />
      </Button>
      <Button variant="default" size="icon" aria-label="Italic" className="w-6 h-6 sm:w-8 sm:h-8">
        <Italic className="w-4 h-4 sm:w-5 sm:h-5" />
      </Button>
      <Button variant="default" size="icon" aria-label="Change case" className="w-6 h-6 sm:w-8 sm:h-8">
        aA
      </Button>
      <Button variant="default" size="icon" aria-label="Underline" className="w-6 h-6 sm:w-8 sm:h-8">
        <Underline className="w-4 h-4 sm:w-5 sm:h-5" />
      </Button>
      <Button variant="default" size="icon" aria-label="Align text" className="w-6 h-6 sm:w-8 sm:h-8">
        <AlignLeft className="w-4 h-4 sm:w-5 sm:h-5" />
      </Button>
      <Button variant="default" size="icon" aria-label="Select area" className="w-6 h-6 sm:w-8 sm:h-8">
        <div className="flex shrink-0 w-3 h-3 sm:w-4 sm:h-4 rounded border border-white border-solid"></div>
      </Button>
      <div className="flex gap-1 sm:gap-2 ml-auto">
        <Button variant="default" size="icon" aria-label="Add shape" className="w-6 h-6 sm:w-8 sm:h-8">
          <img loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/TEMP/f175bfb4432f331a0e6d522eac6042de6c99fb76586831462bf76b727116e06d?placeholderIfAbsent=true&apiKey=63d274d5dd09415cb8f5e51781b306a4" alt="" className="object-contain w-full h-full rounded-none" />
        </Button>
        <Button variant="default" size="icon" aria-label="Add image" className="w-6 h-6 sm:w-8 sm:h-8">
          <img loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/TEMP/f1dff542c81b18f169c1719a5589a4bc911de3cd8aedd1b4a946fc58e9de21fa?placeholderIfAbsent=true&apiKey=63d274d5dd09415cb8f5e51781b306a4" alt="" className="object-contain w-full h-full rounded-none" />
        </Button>
        <Button variant="default" size="icon" aria-label="Refresh preview" className="w-6 h-6 sm:w-8 sm:h-8" onClick={onRefresh}>
          <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5" />
        </Button>
      </div>
    </div>
  );
};

export default TextEditor;