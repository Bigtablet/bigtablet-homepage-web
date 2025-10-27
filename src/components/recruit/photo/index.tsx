type PhotoUploaderProps = {
    previewUrl: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onClear: () => void;
};

const PhotoUploader = ({ previewUrl, onChange, onClear }: PhotoUploaderProps) => {
    return (
        <>
            <label>프로필 사진*</label>
            <div className="photo">
                <label className="photo__box">
                    <input name="photo" type="file" accept="image/png" hidden onChange={onChange} />
                    {previewUrl ? (
                        <img src={previewUrl} alt="프로필 미리보기" className="photo__img" />
                    ) : (
                        <span>+</span>
                    )}
                </label>

                {previewUrl && (
                    <button type="button" className="btn ghost" onClick={onClear}>
                        제거
                    </button>
                )}

                <p>PNG 파일만 업로드 가능합니다.</p>
            </div>
        </>
    );
};

export default PhotoUploader;