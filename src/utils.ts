export function convertFileToBase64(file: File) {
	return new Promise<string>((resolve, reject) => {
		const reader = new FileReader();

		reader.onload = function (event) {
			const result = event.target?.result;
			if (typeof result == 'string') {
				resolve(result.split(",")[1]);
			} else {
				reject(new Error("Can not get reader result"));
			}
		};
		reader.onerror = () => {
			reject(new Error("Reader error"));
		};

		reader.readAsDataURL(file);
	});
}
