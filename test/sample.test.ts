import { expect, test } from "bun:test";
import { User } from "../src/classes/user";

test("Building an User instance should create a fresh user object.", async () => {
    const user = await User.build({
        id: "uuid",
        name: "user",
        ratings: [],
    });
    expect(user.id).toBe("uuid");
    expect(user.name).toBe("user");
    expect(user.ratings).toBe([]);
});
