import assert from "assert";
import FlawCraLIB from "../src/FlawCraLIB.js";

it("sha256 should match", () => {
  assert.equal(
    FlawCraLIB.sha256_hash("abc"),
    "ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad",
  );
});
