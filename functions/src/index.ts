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
// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
//const db = admin.firestore();

// export const writeToTagListWhenNewTag = 
// functions.firestore
//     .document('audios/{clipID}/{tags}/{tag}')
//     .onCreate( (snapshot, context) => {
//         const newTag = snapshot.data();
//             if(newTag !== undefined){
//                 const tag = newTag.id();
    
//                 return db.collection('tagList').doc(tag).update({
//                         count: admin.firestore.FieldValue.increment(1)
//                     });
//                 }
//             else{
//                 return null
//             }
//     })
// export const writeToFirestoreOnUpdated = 
// functions.firestore
//     .document('users/{userId}/{clipHistory}/{clipId}')
//     .onCreate((snapshot, context) => {
//         const newId = snapshot.data();
//             if(newId !== undefined){
//                 const count = newId.count;
//                 return db.collection('tagList').doc('bird').set({
//                     count: count
//                 });
//             }else{
//                 return null
//             }
//     })
    // .onUpdate((change, context) => {
    //     const before = change.before.data();
    //     const after = change.after.data();
    //     if(before !== undefined && after !== undefined && before.username === after.username){ return null}
    //     return change.after.ref.set({
    //         username: after
    //     })
    // });
    
   
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
                //clipArray.push(clip.id);  
                if(!ClipIDSet.has(clip.id)){
                    const tempPromise = await db.collection('audios').doc(clip.id).get();
                    myObjectPromise.push(tempPromise);     
                    ClipIDSet.add(clip.id); 
                    ClipArray.push(clip.id);   
                }
            }
        }
        // Promise.all(myObjectPromise)
        // .then(p => {
        //     p.forEach(objSnap => {
        //         MyObject.push(new MyData(objSnap.id, objSnap?.data()?.Title, objSnap?.data()?.Url))
        //     })
        // })
        // .catch(error => {
        //     console.log("Unable to create my objects");
        // })
        const TagPromise = [];
        for(let _i = 0; _i < ClipArray.length; _i++){
            const tagSnapshot = await db.collection('audios').doc(String(ClipArray[_i])).collection('tags').get();
            TagPromise.push(tagSnapshot);
        }
        
        const AllTagPromise = await Promise.all(TagPromise);
        for(let _i = 0; _i < ClipArray.length; _i++){
            let obj = new MyData(myObjectPromise[_i].id, myObjectPromise[_i]?.data()?.Title, myObjectPromise[_i]?.data()?.Url);
            AllTagPromise[_i].forEach(doc => {
                obj.addTag(doc.id, doc.data().count)
            })
            MyObject.push(obj)
        }
        console.log(MyObject);
        response.send(MyObject);
        
        //  const TagArray:String[] = [];
        //  const countArray = [];
        //  const countPromise = [];

        //  const all = await Promise.all(promise)
        //  for(const p of all){
        //     for(const tag of p.docs){
        //         TagArray.push(String(tag.id));
        //         const mypromise = await tag.ref.get();
        //         countPromise.push(mypromise);
        //     }
        //  }
        //  const allCount = await Promise.all(countPromise);
        //  for(const myCount of allCount){
        //      const data = myCount.data();
        //      if(data !== undefined){
        //         countArray.push(data.count);
        //      }          
        //  }

        //   const TagMap = new Map();
        //   for(let _i = 0; _i < TagArray.length; _i++){
        //       if(TagMap.has(TagArray[_i])){
        //         TagMap.set(TagArray[_i], TagMap.get(TagArray[_i])+countArray[_i]);
        //       }else{
        //         TagMap.set(TagArray[_i], countArray[_i]);
        //       }
        //   }
        // //  response.write(TagArray.toString());
        // //  response.write(countArray.toString());
        // // response.end();
        // console.log(TagMap.size);
        //   console.log(TagMap);
        // response.send(TagMap.toString());
    }
    catch(error){
        console.log("this error " + error);
    }
})
// export const getNewTag = functions.https.onRequest(async (request,response) => {
//     const tagsDocument = await db.collection('audios').doc('102').collection('tags').get();
//     const data: String[] = [];
//     tagsDocument.forEach(tag => {
//         data.push(String(tag.id));
//     })
//     response.send(data)
//     return null;
// })




// export const getClipHistory = functions.https.onRequest((request, response) => {
//     admin.firestore().doc('users/RgNO3TJSxPTUFZ7mfeVR0P2LlWS2').get()
//     .then(snapshot => {
//         const data = snapshot.data()
//         console.log("resolve!!!")
//         response.send(data)
//     })
//     .catch(error => {
//         console.log(error)
//         response.status(500).send(error)
//     })
// })
