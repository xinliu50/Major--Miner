import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';


admin.initializeApp();
const db = admin.firestore();

class MyData{
    ID: String;
    InnerMap: Map<String, number>;
    Title: String;
    Url: String;
    constructor(id: String, title: String, url: String){
        this.ID = id;
        this.InnerMap = new Map();
        this.Title = title;
        this.Url = url;
    }
    addTag(tag: String, count: number):void{
        if(!this.InnerMap.has(tag))
            this.InnerMap.set(tag,count);
        else{
            const mycount = this.InnerMap.get(tag)
            if(mycount !== undefined)
                this.InnerMap.set(tag, mycount+count);
        }
    }
}
export const getTagIds = functions.https.onRequest(async (request,response) => {
    const docSnapshot = await db.collection('users').get();
    const MyObject: MyData[]= [];
    const ClipIDSet = new Set();
    const ClipArray = [];
    try{
       const myObjectPromise =[];
        for(const user of docSnapshot.docs){
            const clipId = await db.collection('users').doc(user.id).collection('clipHistory').get()
            for(const clip of clipId.docs){
                if(!ClipIDSet.has(clip.id)){
                    const tempPromise = await db.collection('audios').doc(clip.id).get();
                    myObjectPromise.push(tempPromise);     
                    ClipIDSet.add(clip.id); 
                    ClipArray.push(clip.id);   
                }
            }
        }
        const TagPromise = [];
        for(let _i = 0; _i < ClipArray.length; _i++){
            const tagSnapshot = await db.collection('audios').doc(String(ClipArray[_i])).collection('tags').get();
            TagPromise.push(tagSnapshot);
        }
        
        const AllTagPromise = await Promise.all(TagPromise);
        const totalCount = new Map();
        for(let _i = 0; _i < ClipArray.length; _i++){
            let obj = new MyData(myObjectPromise[_i].id, myObjectPromise[_i]?.data()?.Title, myObjectPromise[_i]?.data()?.Url);
            AllTagPromise[_i].forEach(doc => {
                obj.addTag(doc.id, doc.data().count)
                if(!totalCount.has(doc.id)){
                    totalCount.set(doc.id, doc.data().count)
                }else{
                    totalCount.set(doc.id, totalCount.get(doc.id)+doc.data().count)
                }
            })
            MyObject.push(obj)
        }
        console.log(MyObject);
        console.log(totalCount);
       
        MyObject.forEach(obj => {
           WriteToFireBase(obj)
            .then(pro => {     
                return null;
            })
            .catch(error => {
                console.log("Unable write to firebase");
            })
        })
        WriteCount(totalCount)
        .then(pro => {     
            return null;
        })
        .catch(error => {
            console.log("Unable write to tagList count");
        })     
        response.send(MyObject);
    }
    catch(error){
        console.log("this error " + error);
    }
})

async function WriteToFireBase(obj: MyData){
    let map = obj.InnerMap;
    const myPromise = [];
    for(const key of map.keys()){
        const promise = await db.collection('tagList').doc(String(key)).collection('clipIDs').doc(String(obj.ID)).set({
            count: map.get(key),
            Title: obj.Title,
            Url: obj.Url
        })
        myPromise.push(promise);
    }
    return Promise.all(myPromise);
}
async function WriteCount(map: Map<string,number>){
    const promiseArray = []
    for(const key of map.keys()){
        const promise = await db.collection('tagList').doc(String(key)).set({
            count: map.get(key)
        })
        promiseArray.push(promise)
    }
    return Promise.all(promiseArray)
}