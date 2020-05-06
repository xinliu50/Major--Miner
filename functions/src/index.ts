import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
// import * as util from 'util';

admin.initializeApp();
const db = admin.firestore();
const audioRef = db.collection('audios');

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
            const obj = new MyData(myObjectPromise[_i].id, myObjectPromise[_i]?.data()?.Title, myObjectPromise[_i]?.data()?.Url);
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
    const map = obj.InnerMap;
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

interface Info {
    title: string;
    url: string;
    other: string;
    TAG: string;
}
interface ClipHistory{
    [key: string] : Info
}

export const getSummary_CallFromClient_v1 = functions.https.onCall(async(data,context) => {
    const userID = data.uid;
    let result = [];
    try{
        if(userID){
            const userRef = db.collection('users').doc(userID);
            let tempTag = [];
            let tempTag1 = [];
            const clipHistorySnapshot = await userRef.collection('clipHistory').orderBy('lastUpdatedAt').limit(10).get();
            const clipHistory: ClipHistory = {};
            if(clipHistorySnapshot){
                for (const clip of clipHistorySnapshot.docs){
                    clipHistory[clip.id] = {title: "", url: "", other: "", TAG: ""};
                    const audio = audioRef.doc(clip.id).get();
                    tempTag = [];
                    tempTag1 = [];
                    const tagsSnapshot = audioRef.doc(`${clip.id}/users/${userID}`).get();  //doc(clip.id).collection('users').doc(userID).get();
                    const otherTagSnapshot = audioRef.doc(clip.id).collection('tags').get();
                    const [audio1,tagsSnapshot1,otherTagSnapshot1] = await Promise.all([audio,tagsSnapshot,otherTagSnapshot]);
                    if(audio1 && tagsSnapshot1 && otherTagSnapshot1){
                        clipHistory[clip.id].title = audio1.data()?.Title;
                        clipHistory[clip.id].url = audio1.data()?.Url;
                        tempTag = tagsSnapshot1.data()?.tags;
                        clipHistory[clip.id].TAG = tempTag.join(", ");
                        for(const tag of otherTagSnapshot1.docs)
                            if(!tempTag.includes(tag.id))
                            tempTag1.push(tag.id);
                        clipHistory[clip.id].other = tempTag1.join(", ");
                    }
                }
                result.push(clipHistory);
            }
            clipHistorySnapshot.docs
            const scoredClipHistorySnapshot = await userRef.collection('clipHistory').where("score", ">", 0).orderBy("score").limit(10).get();
            const scoredClipHistory: ClipHistory = {};
            if(scoredClipHistorySnapshot){
                for(const clip of scoredClipHistorySnapshot.docs){
                    scoredClipHistory[clip.id] = {title: "", url: "", other: "", TAG: ""};
                    const audioSnapshot = audioRef.doc(clip.id).get();
                    const scoreTagsSnapshot = audioRef.doc(clip.id).collection('users').doc(userID).get();
                    const otherScoreTagSnapshot = audioRef.doc(clip.id).collection('tags').get();
                    const [audio1,scoreTagsSnapshot1,otherScoreTagSnapshot1] = await Promise.all([audioSnapshot,scoreTagsSnapshot,otherScoreTagSnapshot]);

                    scoredClipHistory[clip.id].title = audio1.data()?.Title;
                    scoredClipHistory[clip.id].url = audio1.data()?.Url;
                    tempTag = [];
                    tempTag1 = [];
                    tempTag = scoreTagsSnapshot1.data()?.tags;
                    scoredClipHistory[clip.id].TAG = tempTag.join(", ");

                    for(const tag of otherScoreTagSnapshot1.docs)
                        if(!tempTag.includes(tag.id))
                        tempTag1.push(tag.id);
                    
                    scoredClipHistory[clip.id].other = tempTag1.join(", ");          
                }
                result.push(scoredClipHistory);
            }
            return result;
        }else{
            console.log("not user id")
            return "Error, Not userId";
        }
    }catch(err){
        console.log("error")
        return "eoorr"
    }
});

export const getOtherTags = functions.https.onRequest(async (request,response) => {

})