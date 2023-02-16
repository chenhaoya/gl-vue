import http from '@/utils/httpRequest.js'
export function doPut(url, formData) {
    return new Promise((resolve, reject) => {
        console.log("------------------")
        console.log(url)
        console.log(formData)
        console.log("------------------")
        http({
            url: url,
            method: "put",
            headers: {
                "Content-Type": "image/png"
            },
            data: formData//http.adornParams({})
        }).then(({ data }) => {
            resolve(data);
        })
    });
}