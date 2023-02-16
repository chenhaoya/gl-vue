import http from '@/utils/httpRequest.js'
export function policy(uid, name, type, lastModifiedDate) {
    return new Promise((resolve, reject) => {
        http({
            url: http.adornUrl("/thirdparty/oss/policy"),
            method: "get",
            params: {
                uid: uid,
                name: name,
                type: type,
                lastModifiedDate: lastModifiedDate
            }//http.adornParams({})
        }).then(({ data }) => {
            resolve(data);
        })
    });
}