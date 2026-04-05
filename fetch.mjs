async function run() {
  try {
    const res = await fetch("http://localhost:3000/api/dashboard/summary", {
      headers: { "X-User-Id": "cmnm0108h0000140a9pp76bpy3" },
      cache: 'no-store'
    });
    console.log("STATUS:", res.status);
    console.log("DATA:", await res.json());
  } catch(e) {
    console.error(e);
  }
}
run();
