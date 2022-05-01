import * as htmlToImage from 'html-to-image';

function toPascalCase(text) {
    return text
        .replace(new RegExp(/[-_]+/, 'g'), ' ')
        .replace(new RegExp(/[^\w\s]/, 'g'), '')
        .replace(
            new RegExp(/\s+(.)(\w*)/, 'g'),
            ($1, $2, $3) => `${$2.toUpperCase() + $3.toLowerCase()}`
        )
        .replace(new RegExp(/\w/), s => s.toUpperCase());
};

const useHtmlToImage = function () {
    function convertToImage(elementId, type = 'png', extendOptions={}) {
        if (!elementId) {
            return;
        }
        if (typeof htmlToImage['to' + toPascalCase(type)] !== 'function') {
            console.error('Oops, something went wrong!', 'Method not allowed');
        }

        const node = document.getElementById(elementId),
              options = { backgroundColor: '#FFF', ...extendOptions };

        return htmlToImage['to' + toPascalCase(type)](node, options)
            .then(function (dataUrl) {
                const link = document.createElement('a');
                link.download = 'my-image-name.jpeg';
                link.href = dataUrl;
                link.click();
                return;
                // const imgElement = new Image();
                // imgElement.src = dataUrl;
                // return imgElement;
            })
            .catch(function (error) {
                console.error('Oops, something went wrong!', error);
            });
    }
    return { convertToImage };
}

export default useHtmlToImage;