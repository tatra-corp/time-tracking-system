
export async function getRecords(offset, limit) {
  const Http = new XMLHttpRequest();
  const url = `/records?offset=${offset}&limit=${limit}`;
  Http.open('GET', url);
  Http.send();

  return new Promise((resolve, reject) => {
    Http.onload = () => {
      if (Http.status === 200) {
        resolve(JSON.parse(Http.responseText));
      } else {
        console.error(`Muhaha, I lied, I will log into console till I die!\nResponse status: ${Http.status}`);
        reject();
      }
    };
  });
}

export async function getActiveRecordFor(username) {
  const Http = new XMLHttpRequest();
  const url = `/records?username=${username}&active=true`;
  Http.open('GET', url);
  Http.send();

  return new Promise((resolve, reject) => {
    Http.onload = () => {
      if (Http.status === 200) {
        try {
          resolve(JSON.parse(Http.responseText));
        } catch (SyntaxError) {
          reject();
        }
      } else {
        console.error(`Muhaha, I lied, I will log into console till I die!\nResponse status: ${Http.status}`);
        reject();
      }
    };
  });
}

export async function deleteRecord(user, start) {
  const Http = new XMLHttpRequest();
  const url = `/records?username=${user}&start=${start}`;
  Http.open('DELETE', url);
  Http.send();

  return new Promise((resolve, reject) => {
    Http.onload = () => {
      if (Http.status === 200) {
        resolve(JSON.parse(Http.responseText));
      } else {
        console.error(`Muhaha, I lied, I will log into console till I die!\nResponse status: ${Http.status}`);
        reject();
      }
    };
  });
}
