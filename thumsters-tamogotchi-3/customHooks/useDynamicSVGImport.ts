import { useEffect, useState, useRef } from 'react'

export interface UseDynamicSVGImportOptions {
  onCompleted?: (
    path: string,
    SvgIcon: React.FC<React.SVGProps<SVGSVGElement>> | undefined
  ) => void;
  onError?: (err: Error) => void;
}

export function useDynamicSVGImport(path: string, options: UseDynamicSVGImportOptions = {}) {
  const ImportedIconRef = useRef<React.FC<React.SVGProps<SVGSVGElement>>>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error>();

  const { onCompleted, onError } = options;
  useEffect(() => {
    setLoading(true);
    const importIcon = async (): Promise<void> => {
      try {
        ImportedIconRef.current = (
          await import(`./${path}.svg`)
        ).ReactComponent;
        onCompleted?.(path, ImportedIconRef.current);
      } catch (err: any) {
        onError?.(err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    importIcon();
  }, [path, onCompleted, onError]);

  return { error, loading, SvgIcon: ImportedIconRef.current };
}

interface SvgProps extends React.SVGProps<SVGSVGElement> {
  path: string;
}

export const Svg: React.FC<SvgProps> = ({
  path,
  ...rest
}): React.ReactNode | null => {
  return null;
};