it("should process animation nodes via SAM API", async () => {
    const response = await fetch("http://127.0.0.1:3000/migrate/animation", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify([
            { name: "TestAnimation1", primaryPoseType: "POSE_1" },
            { name: "TestAnimation2", primaryPoseType: "POSE_2" },
        ]),
    });

    expect(response.status).toBe(200);
});