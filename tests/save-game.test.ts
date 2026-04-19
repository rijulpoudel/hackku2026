import { PlayerState } from "@/types/game";
import {
  deleteSave,
  hasSaves,
  listSaves,
  loadSave,
  saveGame,
} from "@/lib/save-game";

const SAVE_KEY = "launch_saves";

function makePlayerState(overrides: Partial<PlayerState> = {}): PlayerState {
  return {
    userId: "u1",
    name: "Alex",
    character: "alex",
    age: 22,
    currentYear: 1,
    netWorth: 1000,
    annualSalary: 58000,
    savings: 1000,
    loanBalance: 0,
    retirement401k: 0,
    creditCardDebt: 0,
    monthlyExpenses: 2000,
    ownsHome: false,
    hasEmergencyFund: false,
    isFreelancing: false,
    hasInvested: false,
    took401kMatch: false,
    filedTaxesCorrectly: false,
    hasNegotiatedSalary: false,
    hasChildren: false,
    hadJobLoss: false,
    isPSLFEligible: false,
    isPensionEnrolled: false,
    isGradStudent: false,
    hasLLC: false,
    decisions: [],
    ...overrides,
  };
}

describe("save-game", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it("saves and loads a game slot", () => {
    vi.spyOn(Date, "now").mockReturnValue(1700000000000);
    const state = makePlayerState({ name: "Riju", character: "custom" });
    const slot = saveGame(state);

    expect(slot.characterName).toBe("Riju");
    expect(slot.characterEmoji).toBe("✨");
    expect(loadSave(slot.id)).toEqual(state);
    expect(hasSaves()).toBe(true);
  });

  it("lists saves newest first", () => {
    localStorage.setItem(
      SAVE_KEY,
      JSON.stringify([
        { id: "a", savedAt: 100, playerState: makePlayerState() },
        { id: "b", savedAt: 300, playerState: makePlayerState() },
        { id: "c", savedAt: 200, playerState: makePlayerState() },
      ]),
    );

    expect(listSaves().map((s) => s.id)).toEqual(["b", "c", "a"]);
  });

  it("keeps only 5 latest slots and supports deletion", () => {
    const mockedNow = vi.spyOn(Date, "now");
    for (let i = 1; i <= 6; i++) {
      mockedNow.mockReturnValue(i);
      saveGame(makePlayerState({ currentYear: i }));
    }

    const saves = listSaves();
    expect(saves).toHaveLength(5);
    expect(saves.map((s) => s.id)).toEqual([
      "save_6",
      "save_5",
      "save_4",
      "save_3",
      "save_2",
    ]);

    deleteSave("save_4");
    expect(listSaves().map((s) => s.id)).toEqual([
      "save_6",
      "save_5",
      "save_3",
      "save_2",
    ]);
  });
});
