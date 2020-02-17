import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';


admin.initializeApp();
const db = admin.firestore();
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
    const clipArray:String[] = [];
    const docSnapshot = await db.collection('users').get();
    try{
        for(const user of docSnapshot.docs){
            const clipId = await db.collection('users').doc(user.id).collection('clipHistory').get()
            for(const clip of clipId.docs){
                clipArray.push(clip.id);
            }
        }
        const promise = [];
        for(const clipid of clipArray){
            const tagSnapshot = await db.collection('audios').doc(String(clipid)).collection('tags').get();
            promise.push(tagSnapshot);
        }
         const all = await Promise.all(promise)
         const TagSet = new Set();
         for(const p of all){
            for(const tag of p.docs){
                TagSet.add(tag.id);
            }
         }
         response.send(TagSet);
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
